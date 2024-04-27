FROM nginx

ENV UPSTREAM_SERVER=http://localhost:3000

COPY src /usr/share/nginx/html

COPY ./config/default.conf.template /etc/nginx/templates/

EXPOSE 80