FROM nginx:alpine

ENV UPSTREAM_SERVER=http://localhost:3000

COPY src /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY ./config/default.conf /etc/nginx/conf.d/

EXPOSE 80

CMD /bin/sh -c "envsubst '\$UPSTREAM_SERVER' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"