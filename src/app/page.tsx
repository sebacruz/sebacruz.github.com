import { parse } from "yaml";
import fs from "fs";
import path from "path";
import { marked } from "marked";
import { ContactData, Data, ExperienceData, ProjectData } from "@/types/data";

async function getData(): Promise<Data> {
  const filePath = path.join(process.cwd(), "src/config.yml");
  const fileContent = fs.readFileSync(filePath, "utf8");

  return await parse(fileContent) as Data;
}

export default async function Home() {
  const data = await getData();

  return (
    <main className="
      container
      max-w-5xl
      p-10

      prose
      prose-zinc

      prose-headings:uppercase
      prose-headings:text-base
      prose-headings:leading-7
      prose-lead:text-base

      dark:prose-invert

      print:p-0
      print:leading-normal
      print:text-xs
    ">
      <header className="mb-16 print:mb-8">
        <h1 className="mb-0">{data.name}</h1>
        <p className="m-0 lead">{data.title}</p>
      </header>

      <div className="mb-16 print:mb-10">
        <div dangerouslySetInnerHTML={{ __html: marked(data.summary) }} />
      </div>

      <div className="grid sm:grid-cols-3 gap-16 print:mb-8">
        <div className="sm:col-span-2">
          <section className="mb-16 print:mb-8">
            <h1>{data.contact.title}</h1>

            <dl className="inline-definitions">
              {data.contact.data &&
                data.contact.data.map(({ label, value }: ContactData) => (
                  <>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </>
                ))}
            </dl>
          </section>

          <section className="mb-16 print:mb-8">
            <h1>{data.experience.title}</h1>

            {data.experience.data &&
              data.experience.data.map((job: ExperienceData) => (
                <article key={job.company} className="mb-8 prose-headings:normal-case prose-headings:mb-0 prose-lead:mt-0">
                  <header>
                    <h1 className="print:text-xs">{job.role}</h1>
                    <p className="lead print:text-xs">
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

          <section className="mb-16 print:mb-8">
            <h1>{data.projects.title}</h1>

            {data.projects.data &&
              data.projects.data.map((project: ProjectData, index) => (
                <article key={index} className="mb-8 prose-headings:normal-case prose-headings:mb-0 prose-lead:mt-0">
                  <h1 className="print:text-xs">
                    {project.url ? (
                      <a href={project.url} className="print:no-underline">{project.name}</a>
                    ) : (
                      project.name
                    )}
                  </h1>

                  <p className="lead print:text-xs">{project.technologies.join(", ")}</p>

                  <div dangerouslySetInnerHTML={{ __html: marked(project.description) }} />
                </article>
              ))}
          </section>
        </div>

        <div>
          <section className="mb-16 print:mb-8 col-span-1">
            <h1>{data.skills.title}</h1>

            <dl>
              {data.skills.data.map(({name, items}) => (
                <>
                  <dt>{name}</dt>
                  <dd className="print:p-0">{items.join(", ")}</dd>
                </>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </main>
  );
}
