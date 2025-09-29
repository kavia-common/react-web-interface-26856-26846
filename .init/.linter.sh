#!/bin/bash
cd /home/kavia/workspace/code-generation/react-web-interface-26856-26846/frontend_react
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

