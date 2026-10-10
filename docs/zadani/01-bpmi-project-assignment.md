# Odkaz 1 – BPMI Project Assignment (obecné zadání projektu)

| | |
|---|---|
| **Zdroj** | uuApp → dokument „BPMI Project Assignment – Zadání“ (složka *assignments*), kurz *Projektový management – 2026 zima (distanční česky)* |
| **URL** | https://uuapp.plus4u.net/uu-managementkit-maing02/38744216cb324edca986789798259ba9/document?oid=6a61d14de4c6fd72c8736606&pageOid=6a61d151e4c6fd72c873662d |
| **Staženo** | 10. 10. 2026 |
| **Stránky dokumentu** | 1) **BPMI Project Assignment** (hlavní – platí pro nás) · 2) BPMI SubjectMan Assignment · 3) BPMI SubjectTermMan Assignment (2 a 3 jsou předpřipravená alternativní témata – my máme vlastní téma) |
| **Přílohy / komentáře** | 0 / 0 |

> Text níže je věrný přepis stránky (originál je anglicky, ponechán anglicky). Obrázky/ikony nahrazeny textem.

---

## Stránka 1: BPMI Project Assignment (platí pro náš projekt)

_The page contains detailed project assignment._

### Assignment

The aim of the project is to design and develop a cloud-based application that addresses a business discipline of your choice, which will be approved by the teacher.

> ✅ Your task is to **design and develop an application addressing a real-world problem**. The final solution will represent an MVP (minimum viable product), and the cloud application will be accessible from the Internet.

> ℹ️ When choosing a task, we recommend focusing on the specifics of that task, defining the main features, and concentrating on basic functionality so that your application truly represents an MVP.

Examples of possible tasks:

- **Reservation System** – An application that allows users to book appointments with doctors, masseurs, in restaurants, etc.
- **Task Manager** – A simple tool for tracking tasks with the possibility of sharing among team members.
- **Crowdfunding Platform** – A web application that allows people to present their projects and seek funding.
- **Fitness Tracking App** – Recording workouts, diet, and tracking progress.
- **Energy Consumption Tracking App** – Users can monitor their electric energy consumption and seek ways to save.

### Requirements/limitations

Your solution must take into account the following requirements:

| # | Požadavek | Text ze zadání |
|---|---|---|
| 1 | **Approve the basic idea of the task** | Prepare and get approval for the basic idea of the task that you will address in the semester work. ❗ Your solution must contain **at least 4 entities (related to the business area of your application)** whose data will be stored in the database. **User management entities (user, role, etc.) are not related to the business area of your application** and are therefore not included in the 4 required entities! |
| 2 | **Microservice Architecture** | The application is built on a microservices architecture. |
| 3 | **API** | Your solution provides a public API, either REST or GraphQL |
| 4 | **Core Technologies** | Backend technologies: `Node.js`, `Express`, `NoSQL` or `SQL database` · Frontend technologies: `React` |
| 5 | **Required System Use-Cases** | Authorization and authentication · Registration using 3rd party identity providers (e.g. Google, Microsoft, Apple) · Audit log |
| 6 | **Cloud** | Application is deployed and accessible from the Internet. If your solution is based on uuApp Framework, Unicorn University provides cloud resources for student's projects. |
| 7 | **Project Documentation** | Create project documentation according to the uuApp Framework (books **Business Requests, Business Model, Application Model**). |
| 8 | **Project Management** | Manage the entire project through sprints, use the **uuSprintMan** application. |
| 9 | **Git** | Store all source code into a dedicated git repository. |

> 📘 You can also choose one of these predefined assignments: *BPMI SubjectMan Assignment*, *BPMI SubjectTermMan Assignment* (odkazy na stránky 2 a 3 níže).

### Business Requests

> ℹ️ Use document **Business Requests** dedicated for the student project team.

1. **Vision** – Describe Vision of the product.
2. **Dictionary** – Explain the most important terms related to the domain of the application in the Dictionary.
3. **Context** – Create a new page called Context and create an illustrative example which will be used in user stories.
4. **User Story** – Identify and write down the most important User Stories.
   _❗ One user story per team member._ (červeně)

### Business Model

> ℹ️ Use document **Business Model** dedicated for the student project team.

1. **Business Discipline** – Describe the specification of business.
2. **Processes** – Describe all processes and their relations.
3. **Business Actors** – Describe all actors and define if it is business role or business group.
4. **Products** – Describe products (entity from the real world) which are related to this business.
5. **Business Use-cases** – Describe flow of the most important BUCs including wireframe and its description.
   _❗ One BUC per team member._ (červeně)

### Application Model

> ℹ️ Use document **Application Model** dedicated for the student project team.

> ℹ️ Implement the backend and frontend for your **entire application based on your vision**, NOT JUST FOR THE FUNCTIONALITIES YOU DESCRIBE IN THE DOCUMENTATION.
> Store all source code into a dedicated git repository.

> ⚠️ It must be obvious from the design how the described uve (user visual entrypoint), routes and components are connected and nested in each other. Describe all components which are between the above mentioned uve, routes and components.

1. **Standard Application Model pages** – Fill in all the standard Application Model pages (Application Structure, SubApp, Profiles).
2. **Complete Data Model** – Design a complete data model (schema diagram and individual schemas for all objects, their indexes and DAO methods).
3. **Backend endpoints, uve, routes, components and script design** – Design the most important backend endpoints, uve, routes, components and scripts.
   _❗ One backend endpoint per team member._
   _❗ At least two routes per team and all components used on the routes._

---

## Stránka 2: BPMI SubjectMan Assignment (alternativní téma – **nevybrali jsme**)

_The page contains detailed project assignment on the topic of SubjectMan._

> ✅ The **SubjectMan** application allows users to **manage the subjects taught in the school and related study materials.**

**Diagram entit (uuBml):** entity `School`, `Subject`, `Study Programme`, `Digital Content` (poznámka: uuBooks, uuCourses, Video), `External link`, `Topic`. Centrální entita je `Subject` – napojená na `School`, přes vazební (šedé, nepojmenované) entity na `Study Programme` a `Digital Content`, a na `Topic`; `Digital Content` odkazuje na `External link`.

- **School registers its subjects** – The subject holds the following mandatory information: number of credits, supervisor, the goal of the course, degree of study (Bc., Mgr.), the language of study (CZ, EN). Optional information is a description of the subject.
- **Each subject contains taught topics** – The subject also holds information on the organization of teaching and topics by language and form of study.
- **It is possible to manage related study materials in the subject** – The application allows users to store URLs of uuBooks, uuCourses, videos stored in a streaming service. In the case of organizing the teaching of a specific study form, it is possible to save links to specific pages of the books or lessons of the courses.
- **Subjects are grouped to study programmes** – Every subject is grouped to study programme(s) as obligatory, selective or obligatory-selective subject.
- **Other features** – Your solution has to solve: Authorization and authentication · Registration using 3rd party identity providers (e.g. Google, Microsoft) · Audit log · Application is deployed and accessible from the Internet. If your solution is based on uuApp Framework, Unicorn University provides cloud resources for student's projects.

Sekce *Business Requests*, *Business Model scope* a *Application Model scope* jsou **textově shodné** se stránkou 1 (včetně „one user story / one BUC / one backend endpoint per team member“, „at least two routes per team“).

---

## Stránka 3: BPMI SubjectTermMan Assignment (alternativní téma – **nevybrali jsme**)

_The page contains detailed project assignment on the topic of SubjectTermMan._

> ✅ The **SubjectTermMan** application allows users to **manage the subject terms taught in the school including enrolled students, assignments and scores.**

**Diagram entit (uuBml):** `School` ← `Subject` ← `Subject Term`; `Subject Term` je přes vazební (šedou, nepojmenovanou) entitu napojený na `Student` a `Assignment` (poznámka: Tests, Homeworks, Workshops, Hackatons); `Assignment` odkazuje zpět na `Subject Term`.

- **School registers its subjects** – (stejný text jako u SubjectMan)
- **The subject allows the management of assessment activities** – The application allows you to manage individual assessment activities of the relevant subject, which can be tests, assignment, workshops (hackatons), ....
- **The subject term administrates its students** – The application allows users to administrate students who participate the subject term.
- **Student assessment in the subject term** – The application allows users to enter scores that students obtained from individual assessment activities.
- **Other features** – Authorization and authentication · Registration using 3rd party identity providers (e.g. Google, Microsoft) · Audit log · Application is deployed and accessible from the Internet.

Sekce *Business Requests*, *Business Model scope*, *Application Model scope* – **textově shodné** se stránkou 1.

> 💡 Proč je to užitečné i pro nás: oba diagramy ukazují, jakou granularitu entit vyučující očekává (4–6 doménových entit + vazby, user management se nepočítá).
