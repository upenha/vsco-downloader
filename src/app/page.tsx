"use client";
import { scrapeVscoPhoto } from "@/actions/scrape-vsco";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

export default function Home() {
	const [state, formAction] = useFormState(scrapeVscoPhoto, "");
	const [open, setOpen] = useState(false);

	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		setOpen(state !== "Invalid URL" && state !== "");
	}, [state]);

	const handleDialogClose = () => {
		setOpen(!open);
		formRef.current?.reset();
	};
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<form
				ref={formRef}
				action={formAction}
				className="min-w-[400px] h-64 p-4 flex flex-col gap-2 items-start justify-center"
			>
				<div className="w-full flex flex-col gap-1">
					<Input name="photo" placeholder="Enter photo URL" />
					{state === "Invalid URL" && (
						<p className="text-destructive text-sm leading-none">{state}</p>
					)}
				</div>
				<Button type="submit" className="w-full">
					Download
				</Button>
			</form>
			<Dialog open={open} onOpenChange={handleDialogClose}>
				<DialogContent className="w-96 p-8 flex items-center justify-center">
					<div className="w-fit flex items-center justify-center flex-col gap-2">
						<img src={state} alt="VSCO Post" className="w-80 rounded-lg" />
						<Link passHref href={state} className="w-full">
							<Button className="w-full">Download</Button>
						</Link>
					</div>
				</DialogContent>
			</Dialog>
		</main>
	);
}
