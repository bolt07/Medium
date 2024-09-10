import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify, decode } from "hono/jwt";
import { Variables } from "hono/types";
import { createBlog, updateBlog } from "@barbarik_07/medium-common";
export const blogRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	},
	Variables : {
		userId: string
	}
}>();

blogRouter.use("/*", async(c, next) => {
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

    const jwt = c.req.header("Authorization") || "";
    if (!jwt) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	const token = jwt.split(' ')[1];
    try {
        const payload = await verify(token, c.env.JWT_SECRET);
        console.log(payload)
        if (!payload) {
            c.status(401);
            return c.json({ error: "unauthorized" });
        }

        c.set('userId', payload.id as string);
        await next()
    } catch(e) {
        c.status(403);
        return c.json({
            msg: "You are not logged in"
        })
    }
	
})


blogRouter.post('/', async(c) => {
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    const body = await c.req.json();
    const { success } = createBlog.safeParse(body);
    if(!success) {
        c.status(411);
        return c.json({
            msg: "Inputs are incorrect"
        })
    }
    const authorId = c.get("userId")
    const blog = await prisma.blog.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: Number(authorId)
        }
    })
    return c.json({
        id: blog.id
    })
})

blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    const body = await c.req.json();
    const { success } = updateBlog.safeParse(body);
    if(!success) {
        c.status(411);
        return c.json({
            msg: "Inputs are incorrect"
        })
    }
    const blog = await prisma.blog.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content
        }
    })
    return c.json({
        id: blog.id
    })
})

// Todo: Add pagination
blogRouter.get('/bulk', async(c) => {
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    const blogs = await prisma.blog.findMany();
    return c.json({
        blogs
    })

})

blogRouter.get('/get/:id', async(c) => {
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    const blog_id = c.req.param("id");

    try {
        const blog = await prisma.blog.findFirst({
            where: {
                id: Number(blog_id)
            }
        })
        return c.json({
            blog
        })
    } catch(e) {
        c.status(411);
        c.json({
            msg: "Error while fetching blog post"
        })
    }
    
})

