(function(){dust.register("Page",body_0);function body_0(chk,ctx){return chk.write("<div class=\"page\">{").section(ctx.get("elements"),ctx,{"block":body_1},null).write("}</div>");}function body_1(chk,ctx){return chk.write("}{").reference(ctx.get("html"),ctx,"h").write("}{");}return body_0;})();