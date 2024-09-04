"use server";

import { RedirectType, redirect } from "next/navigation";

const userAgents = {
	"Sec-Ch-Prefers-Color-Scheme": "dark",
	"Sec-Ch-Ua":
		'"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
	"Sec-Ch-Ua-Mobile": "?0",
	"Sec-Ch-Ua-Platform": '"Windows"',
	"Sec-Fetch-Site": "same-origin",
	"Sec-Fetch-Dest": "empty",
	"Sec-Fetch-Mode": "cors",
	"User-Agent":
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
};

const regex = /^https:\/\/vsco\.co\/[a-zA-Z0-9_-]+\/media\/[a-zA-Z0-9]{24}$/;

export async function scrapeVscoPhoto(_: unknown, form: FormData) {
	const photo = form.get("photo")?.toString();

	if (!photo || !regex.test(photo)) {
		form.set("photo", "");
		return "Invalid URL";
	}

	const response = await fetch(new URL(photo), {
		method: "GET",
		headers: userAgents,
	});
	const html = await response.text();

	const rawData = html.match(
		/(?<=window\.__PRELOADED_STATE__ = ){.+?}(?=<\/script>)/,
	)?.[0];

	if (!rawData) {
		form.set("photo", "");
		return "Invalid URL";
	}

	const data = JSON.parse(rawData);
	const key = Object.keys(data.medias.byId)[0];
	const rawURL = `https://${data.medias.byId[key].media.responsiveUrl}`;

	const url = new URL(rawURL);
	url.searchParams.set("w", "1200");
	return url.toString();
}
