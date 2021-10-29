"use strict";(self.webpackChunkzio_http_docs=self.webpackChunkzio_http_docs||[]).push([[426],{606:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return p},metadata:function(){return l},toc:function(){return c},default:function(){return v}});var o=n(7462),r=n(3366),a=(n(7294),n(3905)),d=["components"],s={},p="Hello World Advanced",l={unversionedId:"advanced-examples/hello-world-advanced",id:"advanced-examples/hello-world-advanced",isDocsHomePage:!1,title:"Hello World Advanced",description:"",source:"@site/docs/advanced-examples/hello-world-advanced.mdx",sourceDirName:"advanced-examples",slug:"/advanced-examples/hello-world-advanced",permalink:"node-GQL-flash/docs/advanced-examples/hello-world-advanced",editUrl:"https://github.com/facebook/docusaurus/edit/main/website/docs/advanced-examples/hello-world-advanced.mdx",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Hello World",permalink:"node-GQL-flash/docs/zio-http-basic-examples/hello-world"}},c=[],i={toc:c};function v(e){var t=e.components,n=(0,r.Z)(e,d);return(0,a.kt)("wrapper",(0,o.Z)({},i,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"hello-world-advanced"},"Hello World Advanced"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-scala"},'import zhttp.http._\nimport zhttp.service._\nimport zhttp.service.server.ServerChannelFactory\nimport zio._\n\nimport scala.util.Try\n\nobject HelloWorldAdvanced extends App {\n  // Set a port\n  private val PORT = 8090\n\n  private val fooBar: HttpApp[Any, Nothing] = HttpApp.collect {\n    case Method.GET -> !! / "foo" => Response.text("bar")\n    case Method.GET -> !! / "bar" => Response.text("foo")\n  }\n\n  private val app = HttpApp.collectM {\n    case Method.GET -> !! / "random" => random.nextString(10).map(Response.text)\n    case Method.GET -> !! / "utc"    => clock.currentDateTime.map(s => Response.text(s.toString))\n  }\n\n  private val server =\n    Server.port(PORT) ++              // Setup port\n      Server.paranoidLeakDetection ++ // Paranoid leak detection (affects performance)\n      Server.app(fooBar +++ app)      // Setup the Http app\n\n  override def run(args: List[String]): URIO[zio.ZEnv, ExitCode] = {\n    // Configure thread count using CLI\n    val nThreads: Int = args.headOption.flatMap(x => Try(x.toInt).toOption).getOrElse(0)\n\n    // Create a new server\n    server.make\n      .use(_ =>\n        // Waiting for the server to start\n        console.putStrLn(s"Server started on port $PORT")\n\n        // Ensures the server doesn\'t die after printing\n          *> ZIO.never,\n      )\n      .provideCustomLayer(ServerChannelFactory.auto ++ EventLoopGroup.auto(nThreads))\n      .exitCode\n  }\n}\n')))}v.isMDXComponent=!0}}]);