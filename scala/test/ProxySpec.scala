import com.ltfme.loadbalancer.util.Config
import com.typesafe.config.{Config => TConfig}
import com.typesafe.config.ConfigFactory
import org.specs2.mutable._
import org.specs2.runner._
import org.junit.runner._
import play.api.mvc.Cookie

import play.api.test._
import play.api.test.Helpers._

import scala.concurrent.{Future, Await}

/**
 * Add your spec here.
 * You can mock out a whole application including requests, plugins etc.
 * For more information, consult the wiki.
 */
@RunWith(classOf[JUnitRunner])
class ProxySpec extends Specification with Config {
  override val config: TConfig = ConfigFactory.load("test-proxy")

  "Application" should {

    "shoudl redirect to google" in new WithApplication{
      val res = route(FakeRequest(GET, "/").withCookies(Cookie(cookieName, "second")))
      res.get.map(r => {
        println(s"HEADERS: ${r.header}")
        println(s"HEADERS: ${contentAsString(Future(r))}")
      })
    }

//    "send 404 on a bad request" in new WithApplication{
//      route(FakeRequest(GET, "/boum")) must beSome.which (status(_) == NOT_FOUND)
//    }
//
//    "render the index page" in new WithApplication{
//      val home = route(FakeRequest(GET, "/")).get
//
//      status(home) must equalTo(OK)
//      contentType(home) must beSome.which(_ == "text/html")
//      contentAsString(home) must contain ("Your new application is ready.")
//    }
  }

}
