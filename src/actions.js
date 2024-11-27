"use server";

import { addSub, getSubs } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function actionSubmit(prev, formData) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = {
    email: formData.get("email"),
    name: formData.get("name"),
  };
  const errors = {};

  if (!data.name) {
    errors.name = "Name is required";
  }
  if (data.name.length === 1) {
    errors.name = "Does your name really have only one character?";
  }
  if (!data.email || !data.email.includes("@")) {
    errors.email = "Email is required";
  }

  // if (Object.keys(errors).length > 0) {
  //   return { success: false, errors, name: data.name, email: data.email };
  // }
  if (errors.name || errors.email) {
    return { success: false, errors, name: data.name, email: data.email };
  }

  const signups = await getSubs();

  const existingEmail = signups.find((signup) => signup.email === data.email);

  if (existingEmail) {
    return {
      success: false,
      errors: { email: "Denne e-mailadresse er allerede tilmeldt" },
      name: data.name,
      email: data.email,
    };
  }

  const res = await addSub(data);

  if (res) {
    revalidatePath("/");
    return { success: true, message: "Thanks for submitting" };
  } else {
    return { success: false, message: "Failed to submit" };
  }
}
