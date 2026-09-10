# Task Manager

## Project Description

This project is a web-based Task Manager application developed using HTML, CSS, and JavaScript.

The application allows users to create, view, search, complete, and delete tasks. It also provides a local task summary feature for pending tasks.

## Features

* Add a new task
* Add task title and description
* View all tasks
* Search tasks by title
* Mark tasks as completed
* Delete tasks
* Display task statistics
* Generate a summary of pending tasks
* Store tasks using browser LocalStorage
* Responsive user interface

## Technologies Used

* HTML5
* CSS3
* JavaScript
* Browser LocalStorage

## Setup Instructions

No additional software, database, API key, or backend configuration is required.

1. Download or copy the complete project folder.
2. Make sure the following files are present:

   * `index.html`
   * `style.css`
   * `script.js`
3. Open `index.html` in a modern web browser.

## How to Run

Simply open `index.html` in a browser.

Alternatively, the project can be opened using a local development server such as the Live Server extension in Visual Studio Code.

No installation or environment configuration is required.

## Data Storage

The application does not use a traditional database.

Tasks are stored in the browser using LocalStorage. The data is stored as JSON and remains available when the page is refreshed in the same browser.

## AI Task Summary

The task summary feature does not use an external API.

It uses JavaScript logic to analyze pending tasks and generate a local rule-based summary. Priority-related words in task titles and descriptions are used to identify tasks that may require additional attention.

## Assumptions

* The application is designed for a single user.
* No user account or authentication is required.
* Tasks are stored locally in the browser.
* Tasks are not synchronized between different devices or browsers.
* Clearing browser LocalStorage will remove the saved tasks.
* The application does not require an internet connection after the files have been loaded.
* The task summary is rule-based and does not connect to an external AI model.

## Browser Requirements

The application should work in modern browsers that support JavaScript and LocalStorage, including:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari

## Future Improvements

Possible future improvements include:

* User authentication
* Cloud-based task storage
* Database integration
* Task priorities
* Due dates and reminders
* Categories and tags
* Advanced sorting and filtering
* Real AI integration
* Multi-device synchronization
* Notifications
