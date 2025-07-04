FROM postgres AS build

FROM build AS release

COPY entrypoint/ /docker-entrypoint-initdb.d/

FROM build AS devel