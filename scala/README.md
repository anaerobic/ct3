## A/B load balancing proxy CT3

This is a proxy load balancer created to facilitate A/B testing. This means that certain user sessions are assigned to various servers that run a variation of the application in question.  Imagine you want to release a feature to only certain users.  You can create a branch, deploy it to a server and direct x amount of traffic towards that server. You can do the same with multiple branch deployments.


* Concurrency bug (cookie)
* Server strategy with config that allows percentage based assignment
* X-Forward-For/Proto/Host header support
* Refactor as needed
