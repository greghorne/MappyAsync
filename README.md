# MappyAsync

*This Project is under development.*

Scope:  Display a map with geospatial analytics.  Specifically use Bing and Tarmogo isochrone API's.
#
Goal:   Asynchronous coding wherever possible.
#
Comment: I don't think making everything asynchronous is necessarily the ideal implementation for this app.  However, I look forward to learning much more about asynchronous applications by working on this project.  I am not sure what pieces can be made asynchronous at this time other than the API calls.

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
