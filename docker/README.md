# Some QA about this folder for quick consideration.

#### Why is this db here and not in the main grafana folder?

Just for demo purposes so take this account on the code review. So you can just simply run the docker-compose file and
have a nice dashboard with some data.

#### Can I remove it?

Yes you can. But you should import the dashboard from the "docker/dashboard-monitoring-grafana" folder and config the
data sources.

#### What happens if I remove it?

You will lose the data source configuration and the dashboard preconfigured for a nice demo an local testing
environment.

