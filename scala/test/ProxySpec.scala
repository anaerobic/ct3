import com.ltfme.loadbalancer.util.Config
import org.specs2.mutable._
import org.specs2.runner._
import org.junit.runner._
import play.api.mvc.Cookie

import play.api.test._
import play.api.test.Helpers._

import scala.concurrent.duration.Duration
import scala.concurrent.{Future, Await}
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global

/**
 * Add your spec here.
 * You can mock out a whole application including requests, plugins etc.
 * For more information, consult the wiki.
 */
@RunWith(classOf[JUnitRunner])
class ProxySpec extends Specification {

  implicit val timeout = 5 seconds

  "Application" should {

    "should reverse proxy google" in new WithApplication{
      println("START")
      val fut = route(FakeRequest(GET, "/").withCookies(Cookie(Config.cookieName, "second"))).get
      val res = Await.result(fut, timeout)
      res.header.headers.getOrElse("server", "") equals "gws"
      contentAsString(fut) must contain ("Google Search")
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
