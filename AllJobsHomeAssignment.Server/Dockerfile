# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS with-node
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY
ENV HTTP_PROXY=${HTTP_PROXY} \
	HTTPS_PROXY=${HTTPS_PROXY} \
	NO_PROXY=${NO_PROXY}
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates gnupg \
	&& rm -rf /var/lib/apt/lists/*
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get update && apt-get install -y --no-install-recommends nodejs \
	&& rm -rf /var/lib/apt/lists/*


FROM with-node AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["AllJobsHomeAssignment.Server/AllJobsHomeAssignment.Server.csproj", "AllJobsHomeAssignment.Server/"]
COPY ["alljobshomeassignment.client/alljobshomeassignment.client.esproj", "alljobshomeassignment.client/"]
RUN dotnet restore "./AllJobsHomeAssignment.Server/AllJobsHomeAssignment.Server.csproj"
COPY . .
WORKDIR "/src/AllJobsHomeAssignment.Server"
RUN dotnet build "./AllJobsHomeAssignment.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./AllJobsHomeAssignment.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AllJobsHomeAssignment.Server.dll"]
