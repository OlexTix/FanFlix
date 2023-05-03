FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY dist /usr/share/nginx/html
ENTRYPOINT ["nginx", "-g", "daemon off;"]