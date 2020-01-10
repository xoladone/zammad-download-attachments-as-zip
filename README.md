# zammad-download-attachments-as-zip
A simple JS-Overlay for the Zammad ticketsystem to download all attachments of an article as a zip-archive.
This is a *quick and dirty* workaround.
The JS uses a timerfunction to check every second if there are any attachments in articles. If so, it lets you download all attachments of an article (not the whole ticket) by clicking on the paperclip next to the attachments.

## External Sources
This overlay uses the 2 JS libraries from third parties:
- JSZip v3.2.1 - A JavaScript class for generating and reading zip files - https://stuartk.com/jszip
- FileSaver - https://github.com/eligrey/FileSaver.js

## Installation
- Save the external JS-sources and the source-file timed_trigger.js of this repo in the public path. Default path is */opt/zammad/public/*
- You have to customize your default index page of zammad. With every update you have to redo this. Default file is */opt/zammad/app/views/init/index.html.erb*
Insert the three lines at the top of the this file. Easy HTML-Code needed to bind these files.
<pre>
<script src='timed_trigger.js'</script>
<script src='filesaver.js'</script>
<script src='jszip.js'</script>
</pre>

- Restart Zammad: sudo service zammad restart
- Have fun.
