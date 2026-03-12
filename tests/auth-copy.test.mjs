import { expect, test } from "bun:test";
import { authCopy } from "../src/features/auth/model/copy.ts";

test("auth copy defines both entry flows", () => {
	expect(authCopy.login.switchHref).toBe("/signup");
	expect(authCopy.signup.switchHref).toBe("/login");
	expect(authCopy.login.title).toMatch(/welcome/i);
	expect(authCopy.signup.title).toMatch(/create/i);
});
