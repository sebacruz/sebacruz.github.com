#!/bin/bash
# Set the following variables to your system needs
# (Detailed instructions below variables)
#=====================================================================

# Host name (or IP address) of MySQL server e.g localhost
dbservers=( mysql.server.com other.mysqlserver.com mysqlserver.com )

# List of DBNAMES for Daily/Weekly Backup e.g. "DB1 DB2 DB3"
dbs=( db-in-server1 db-in-server2 db-in-server3 )

# Username(s) to access the MySQL server e.g. dbuser or user1 user2 
users=( user-server-1 user-server-2 user-server-3 )

# Username to access the MySQL server e.g. password or pass-user1 pass-user2
pass=( pass-user-1 pass-user-2 pass-user-3 )

# Backup directory location e.g /backups
BACKUPDIR="~/backups"

# Set the maximum allowed email size in k. (4000 = approx 5MB email [see docs])
MAXATTSIZE="4000"

# Email Address to send mail to? (user@domain.com)
MAILADDR="user@domain.com"


# ============================================================
# === ADVANCED OPTIONS ( Read the doc's below for details )===
#=============================================================

# Include CREATE DATABASE in backup?
CREATE_DATABASE=yes

# Choose Compression type. (gzip or bzip2)
COMP=gzip


#=====================================================================
# Should not need to be modified from here down!!
#=====================================================================
PATH=/usr/local/bin:/usr/bin:/bin:/usr/local/mysql/bin 
DATE=`date +%Y-%m-%d_%Hh%Mm`  	# Datestamp e.g 2002-09-21_14h35m
OPT="--quote-names --opt"			# OPT string for use with mysqldump ( see man mysqldump )
BACKUPFILES=""

# Add --compress mysqldump option to $OPT
if [ "$COMMCOMP" = "yes" ];
	then
		OPT="$OPT --compress"
	fi

# Add --compress mysqldump option to $OPT
if [ "$MAX_ALLOWED_PACKET" ];
	then
		OPT="$OPT --max_allowed_packet=$MAX_ALLOWED_PACKET"
	fi

# Create required directories
if [ ! -e "$BACKUPDIR" ]		# Check Backup Directory exists.
	then
	echo Creating $BACKUPDIR
	mkdir -p "$BACKUPDIR"
fi

if [ ! -e "$BACKUPDIR/latest" ]	# Check Latest Directory exists.
	then
		mkdir -p "$BACKUPDIR/latest"
fi

# Delete the latests backups and logs
eval rm -fv "$BACKUPDIR/latest/*"

# Functions
#=====================================================================
# Database dump function
dbdump () {
	mysqldump --user=$1 --password=$2 --host=$3 $OPT $4 > $5
	return 0
}

# Compression function plus latest copy
SUFFIX=""
compression () {
	if [ "$COMP" = "gzip" ]; then
		gzip -f "$1"
		echo
		echo Backup Information for "$1"
		gzip -l "$1.gz"
		SUFFIX=".gz"
	elif [ "$COMP" = "bzip2" ]; then
		echo Compression information for "$1.bz2"
		bzip2 -f -v $1 2>&1
		SUFFIX=".bz2"
	else
		echo "No compression option set, check advanced settings"
	fi
	cp $1$SUFFIX "$BACKUPDIR/latest/$2$SUFFIX"
	return 0
}
#======================================================================

if [ "$SEPDIR" = "yes" ]; then # Check if CREATE DATABSE should be included in Dump
	if [ "$CREATE_DATABASE" = "no" ]; then
		OPT="$OPT --no-create-db"
	else
		OPT="$OPT --databases"
	fi
else
	OPT="$OPT --databases"
fi

#run on each domain
for (( i = 0 ; i < ${#dbservers[@]} ; i++ ))
do
	USER=${users[$i]}
	PASS=${pass[$i]}

	DBHOST=${dbservers[$i]}
	DB=${dbs[$i]}

	# Prepare $DB for using
	DB="`echo $DB | sed 's/%/ /g'`"

	if [ ! -e "$BACKUPDIR/$DB" ]		# Check if the DB Directory exists.
	then
		mkdir -p "$BACKUPDIR/$DB"
	fi

	if [ ! -e "$BACKUPDIR/$DB/$DATE" ]		# Create the Directory for this backup.
	then
		mkdir -p "$BACKUPDIR/$DB/$DATE"
	fi

	LOGFILE=$BACKUPDIR/$DB/$DATE/log.log		# Logfile Name
	LOGERR=$BACKUPDIR/$DB/$DATE/errors.log		# Logfile Name

	# IO redirection for logging.
	touch $LOGFILE
	exec 6>&1           # Link file descriptor #6 with stdout.
		                 # Saves stdout.
	exec > $LOGFILE     # stdout replaced with file $LOGFILE.
	touch $LOGERR
	exec 7>&2           # Link file descriptor #7 with stderr.
		                 # Saves stderr.
	exec 2> $LOGERR     # stderr replaced with file $LOGERR.
	
	echo Weekly Backup of Database $DB
	
	dbdump "$USER" "$PASS" "$DBHOST" "$DB" "$BACKUPDIR/$DB/$DATE/database.sql"

	if [ ! -s "$LOGERR" ]
	then
		compression "$BACKUPDIR/$DB/$DATE/database.sql" $DB
		BACKUPFILES="$BACKUPDIR/$DB/$DATE/database.sql$SUFFIX"
	fi
	
	#Clean up IO redirection
	exec 1>&6 6>&-      # Restore stdout and close file descriptor #6.
	exec 1>&7 7>&-      # Restore stdout and close file descriptor #7.

	if [ -s "$LOGERR" ]
	then
		# Include error log if is larger than zero.
		BACKUPFILES="$BACKUPFILES $LOGERR"
		ERRORNOTE="WARNING: Error Reported - "
	fi
	#Get backup size
	ATTSIZE=`du -c $BACKUPFILES | grep "[[:digit:][:space:]]total$" |sed s/\s*total//`
	if [ $MAXATTSIZE -ge $ATTSIZE ]
	then
		#BACKUPFILES=`echo "$BACKUPFILES" | sed -e "s# # -a #g"`	#enable multiple attachments
		mutt -s "$ERRORNOTE MySQL Backup Log and SQL Files for $DBHOST - $DATE" -a $BACKUPFILES $MAILADDR < $LOGFILE		#send via mutt
	else
		cat "$LOGFILE" | mail -s "WARNING! - MySQL Backup exceeds set maximum attachment size on $DBHOST - $DATE" $MAILADDR
	fi
done
