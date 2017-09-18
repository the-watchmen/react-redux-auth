# keycloak

this library can be used in conjunction with the [keycloak](www.keycloak.org) open-source identity and access management solution from [redhat](https://www.redhat.com/en).

## docker

to facilitate local testing, an instance of keycloak can be run locally in a [docker](https://www.docker.com/) container, using the following command:

```
docker run -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=s3cret -p 9990:8080 --name keycloak jboss/keycloak
```

## configuring keycloak

to configure keycloak to run with the [sample configuration file](example/auth-config.hello.keycloak.js), log into the admin panel and complete the following steps:

1. create realm named `realm-1` and within this realm:
    1. create client named `client-1` and within this client:
        1. within "Settings" tab:
            1. set "Client Protocol" to `openid-connect`
            1. set "Access Type" to `public`
            1. set "Implicit Flow Enabled" to `ON`
            1. add "Valid Redirect URI" of `http://localhost:8080/`
        1. within "Mappers" tab, create Mapper:
            1. set "Mapper Type" to `Group Membership`
            1. set "Token Claim Name" to `groups`
            1. set "Add to ID token" to `ON`
    1. create user named `user-1` (arbitrary name)
    1. create group named `group-1`
    1. associate `user-1` with `group-1`
