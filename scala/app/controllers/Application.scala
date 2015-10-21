package controllers

import javax.inject.Inject

import com.ltfme.loadbalancer.util.Config
import play.api._
import play.api.libs.iteratee.Enumerator
import play.api.libs.ws.{WSClient, WSResponseHeaders, WS}
import play.api.mvc._
import scala.concurrent.ExecutionContext.Implicits.global

import scala.util.Random

class Application @Inject()(ws: WSClient) extends Controller {

  def balance(path: String) = Action.async(parse.raw) {
    request =>
      println(s"PATH: ${path}")
      println(s"SERVERS: ${Config.servers}")
      Ok("DUDE")
      val server = Config.servers(Random.nextInt(Config.servers.size))
      val headers = (request.headers.toMap.toSeq.flatMap {
        case (k, v) => v.map((k, _))
      } filterNot { case (k,_) => k == "Host" }) :+ ("Host" -> server.host.replaceFirst("""^https?://""", ""))
      val queryString = request.queryString.toSeq.flatMap {
        case (k, v) => v.map((k, _))
      }
      val a = "Host" -> ""
      val proxyRequest =
        ws.url(server.host + request.path)
            .withFollowRedirects(true)
            .withMethod(request.method)
            .withHeaders(headers:_*)
            .withQueryString(queryString: _*)
            .withBody(request.body.asBytes().get)

      println(s"REQ HEADERS: ${headers}")
      // Stream the response to the client:
      val r = proxyRequest.get().map {
        r =>
          println(s"BODY: ${r.body}")
          Result(ResponseHeader(r.status, r.allHeaders.mapValues(_.head)), Enumerator(r.bodyAsBytes))
      }
      r
    //      proxyRequest.stream.map {
    //        case (headers: WSResponseHeaders, enum) => {
    //          Result(ResponseHeader(headers.status, headers.headers.mapValues(_.head)), enum)
    //        }
    //      }

  }
}