"use server";

import { notFound, redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export type AcceptanceCriteriaGeneratorProject = {
  id: string;
  name: string;
  project_key: string;
  description: string | null;
};

export async function getAcceptanceCriteriaGeneratorProject(projectId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: project, error } = await supabase
    .from("projects")
    .select("id,name,project_key,description")
    .eq("id", projectId)
    .maybeSingle();

  if (error || !project) {
    notFound();
  }

  return project as AcceptanceCriteriaGeneratorProject;
}
