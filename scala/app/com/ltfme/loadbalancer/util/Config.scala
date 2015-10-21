package com.ltfme.loadbalancer.util

import com.typesafe.config.ConfigFactory
import scala.collection.JavaConversions._

/**
 * User: ilya
 * Date: 10/20/15
 * Time: 5:30 PM
 */
object Config {
  val servers = ConfigFactory.load("servers").getConfigList("servers").map {
    c => Server(c.getString("name"), c.getString("host"))
  }

  final case class Server(name:String, host:String)
}
