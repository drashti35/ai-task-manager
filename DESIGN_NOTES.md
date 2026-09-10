# Task Manager – Design Notes

## 1. Architecture

The Task Manager is a client-side web application built using HTML, CSS, and JavaScript.

* **HTML** provides the structure and user interface.
* **CSS** provides the styling and responsive layout.
* **JavaScript** handles adding, searching, completing, deleting, and summarizing tasks.
* **LocalStorage** stores tasks in the browser.

The application follows a simple architecture:

**User Interface → JavaScript Logic → LocalStorage**

## 2. Database Design

No traditional database is used.

Tasks are stored in the browser using LocalStorage as a JSON array.

Each task contains:

* `id` – Unique identifier
* `title` – Task title
* `description` – Task description
* `status` – Pending or completed
* `createdDate` – Task creation date and time

## 3. APIs

No external API is used.

The pending-task summary is generated locally using JavaScript logic. It analyzes pending tasks and identifies priority-related keywords.

## 4. Assumptions

* The application is designed for a single user.
* No login or authentication is required.
* Tasks are stored locally in the browser.
* Tasks are not synchronized between devices.
* Clearing browser LocalStorage will remove saved tasks.
* The task summary is rule-based and does not use an external AI model.

## 5. Future Improvements

Possible future improvements include:

* Add user authentication.
* Add a backend database.
* Synchronize tasks across multiple devices.
* Add task priorities.
* Add due dates and reminders.
* Add categories and tags.
* Add advanced filtering and sorting.
* Integrate a real AI API.
* Add cloud backup.
* Add notifications.

## Conclusion

The Task Manager is a lightweight client-side application that provides task management functionality without requiring a backend server, database, or external API. The application can be extended in the future with database storage, authentication, cloud synchronization, and real AI integration.
