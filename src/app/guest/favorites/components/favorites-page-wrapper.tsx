"use cache";

export async function FavoritesPageWrapper({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<div className="mb-8">
				<h1 className="text-3xl font-bold">My Favorites</h1>
				<p className="text-muted-foreground mt-2">
					Properties you've saved for later
				</p>
			</div>

			{children}
		</>
	);
}
