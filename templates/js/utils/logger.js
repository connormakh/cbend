const logger = require('tracer').console({
  format: [
    "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})", //default format
    {
      info: "{{timestamp}} <{{title}}> {{message}} (in {{file}} at line: {{line}} from path: {{path}} method: {{method}})",
      error: "{{timestamp}} <{{title}}> {{message}} (in {{file}} at line: {{line}} position: {{pos}})\nfrom path: {{path}} method: {{method}}\nCall Stack:\n{{stack}}"
    }
  ],
  dateformat: "HH:MM:ss.L",
  preprocess: d => {
    d.title = d.title.toUpperCase();
  }
});

module.exports = logger;
