# Resume source

`resume.html` is the source for `../Douglas-Chiemela-CV.pdf`. Edit the HTML, then regenerate the PDF.

Either open `resume.html` in Edge/Chrome → Print → Save as PDF (paper A4, margins Default, headers/footers off),
or run from the repo root (Git Bash on Windows):

```sh
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --no-pdf-header-footer \
  --virtual-time-budget=6000 --print-to-pdf="$(pwd -W)/cv/Douglas-Chiemela-CV.pdf" \
  "file:///$(pwd -W)/cv/source/resume.html"
```

Keep it to two pages.
