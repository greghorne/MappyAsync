# MappyAsync

*This Project is under development.*

Scope:  Display a map and allow for the creation of isochrone (drive time) polygons.  Specifically I will be using Bing Maps AI, HERE API and Targomo API services.
#
Goals:  Create microservices where possible to off load processing.  Also use asynchronous coding where possible.
#
List of APIs that this app will use:
- https://github.com/greghorne/go-api-intersect-usa
- https://github.com/greghorne/go-api-bing
-https://github.com/greghorne/go-api-here
- https://github.com/greghorne/go-api-targomo

#


Tech Stack:

	* Leaflet v1.3.3

    * Rails 5.2.0
    * Ruby  2.5.1p57 (2018-03-29 revision 63029) [i686-linux]

    * PostgreSQL 9.4.15 on armv8l-unknown-linux-gnueabihf, compiled by gcc (Raspbian 4.9.2-10) 4.9.2, 32-bit
    * PostGIS    2.1.4 r12966

    * Vagrant Box:  Distributor ID: Ubuntu
                    Description:	Ubuntu 14.04.5 LTS
                    Release:        14.04
                    Codename:       trusty

    * Deployment Heroku & RaspberryPi (PostgreSQL DB Server)
