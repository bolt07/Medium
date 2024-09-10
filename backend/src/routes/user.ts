
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono';
import { sign } from 'hono/jwt'
import { singupInput, singninInput } from '@barbarik_07/medium-common';

export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();


userRouter.post('/signup', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	//console.log(c.env?.DATABASE_URL)
	const body = await c.req.json();
    console.log(body);
    const { success } = singupInput.safeParse(body);
	if(!success) {
        c.status(411);
        return c.json({
            msg: "Inputs are incorrect"
        })
    }
	try {
		const user = await prisma.user.create({
			data: {
				username: body.username,
				password: body.password
			}
		});
		console.log(user);
		const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
		return c.json({ jwt });
	} catch(e) {
		c.status(403);
        console.log(e)
		return c.json({ error: "error while signing up" });
	}
})

userRouter.post('/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	const body = await c.req.json();
    const { success } = singninInput.safeParse(body);
    if(!success) {
        c.status(411);
        return c.json({
            msg: "Inputs are incorrect"
        })
    }
	try {
		const user = await prisma.user.findFirst({
			where: {
				username: body.username,
				password: body.password,
			}
		})
		if(!user) {
			c.status(403);
			return c.json({
				msg: "Incorrect creds"
			})
		}
		const jwt = await sign({
			id: user.id
		}, c.env.JWT_SECRET);
		return c.json({
			jwt: jwt,
		})
	} catch(e) {
		console.log(e);
		c.status(411);
		c.json({
			msg: "Invalid"
		})
	}
})