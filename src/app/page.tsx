"use client";

import { scrapeVscoPhoto } from "@/actions/scrape-vsco";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { type FormEvent, useRef, useState } from "react";

export default function Home() {
	const [state, setState] = useState<"idle" | "loading" | "error">("idle");
	const [inputValue, setInputValue] = useState("");
	const [open, setOpen] = useState(false);
	const [url, setUrl] = useState("");

	const formRef = useRef<HTMLFormElement>(null);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setState("loading");

		const res = await scrapeVscoPhoto(inputValue).catch((err) => {
			console.error(err);
			return null;
		});

		if (res) {
			setUrl(res);
			setOpen(true);
			setState("idle");
			setInputValue("");
		} else {
			setState("error");
		}
	};

	const handleDialogClose = () => {
		setOpen(false);
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<form
				ref={formRef}
				onSubmit={handleSubmit}
				className="min-w-[400px] h-64 p-4 flex flex-col gap-8 items-start justify-center"
			>
				<h1 className="text-xl font-bold text-center w-full">
					VSCO Photo Downloader
				</h1>

				<div className="w-full flex flex-col gap-2">
					<div className="w-full flex flex-col gap-1">
						<Input
							name="photo"
							placeholder="Enter photo URL"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
						/>

						{state === "error" && (
							<p className="text-destructive text-sm leading-none">
								Invalid URL
							</p>
						)}
					</div>

					<Button
						data-loading={state === "loading"}
						disabled={state === "loading"}
						type="submit"
						className="w-full data-[loading=true]:animate-pulse"
					>
						Download
					</Button>
				</div>
			</form>

			<Dialog open={open} onOpenChange={handleDialogClose}>
				<DialogContent className="w-fit border-none bg-transparent p-0 flex items-center justify-center">
					<div className="w-fit flex items-center justify-center flex-col gap-2">
						<img src={url} alt="VSCO Post" className="w-80 rounded-lg" />
						<Link
							href={url}
							className={buttonVariants({
								className: "w-full",
								variant: "secondary",
							})}
						>
							Download
						</Link>
					</div>
				</DialogContent>
			</Dialog>
		</main>
	);
}
