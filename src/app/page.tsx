import { parse } from "yaml";
import fs from "fs";
import path from "path";
import { marked } from "marked";

async function getData() {
  const filePath = path.join(process.cwd(), "src/config.yml");
  const fileContent = fs.readFileSync(filePath, "utf8");

  return await parse(fileContent);
}

export default async function Home() {
  const data = await getData();

  return (
    <main className="p-10 container max-w-5xl prose prose-slate prose-invert prose-sky prose-headings:uppercase prose-headings:text-base prose-headings:leading-7 prose-lead:text-base">
      <header className="mb-16">
        <h1 className="mb-0">{data.name}</h1>
        <p className="m-0 lead">{data.title}</p>
      </header>

      <div className="mb-16">
        <div dangerouslySetInnerHTML={{ __html: marked(data.summary) }} />
      </div>

      <div className="grid sm:grid-cols-3 gap-16">
        <div className="sm:col-span-2">
          <section className="mb-16">
            <h1>{data.contact.title}</h1>

            <dl className="inline-definitions">
              {data.contact.data &&
                data.contact.data.map(({ label, value }) => (
                  <>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </>
                ))}
            </dl>
          </section>

          <section className="mb-16">
            <h1>{data.experience.title}</h1>

            {data.experience.data &&
              data.experience.data.map((job) => (
                <article key={job.company} className="mb-8 prose-headings:normal-case prose-headings:mb-0 prose-lead:mt-0">
                  <header>
                    <h1>{job.role}</h1>
                    <p className="lead">
                      {job.company} ({job.period})
                    </p>
                  </header>

                  {job.responsibilities && (
                    <ul>
                      {job.responsibilities.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
          </section>

          <section className="mb-16">
            <h1>{data.projects.title}</h1>

            {data.projects.data &&
              data.projects.data.map((project, index) => (
                <article key={index} className="mb-8 prose-headings:normal-case prose-headings:mb-0 prose-lead:mt-0">
                  <h1>
                    {project.url ? (
                      <a href={project.url}>{project.name}</a>
                    ) : (
                      project.name
                    )}
                  </h1>

                  <p className="lead">{project.technologies.join(", ")}</p>

                  <div dangerouslySetInnerHTML={{ __html: marked(project.description) }} />
                </article>
              ))}
          </section>
        </div>

        <div>
          <section className="mb-16 col-span-1">
            <h1>{data.skills.title}</h1>

            <dl>
              {data.skills.data.map(({name, items}) => (
                <>
                  <dt>{name}</dt>
                  <dd>{items.join(", ")}</dd>
                </>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </main>
  );
}
