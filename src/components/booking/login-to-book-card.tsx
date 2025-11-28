import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";

interface LoginToBookCardProps {
	pricePerNight: number;
	propertyId: string;
}

export function LoginToBookCard({
	pricePerNight,
	propertyId,
}: LoginToBookCardProps) {
	return (
		<Card className="sticky top-24">
			<CardHeader>
				<CardTitle className="flex items-baseline gap-2">
					<span className="text-2xl">${pricePerNight}</span>
					<span className="text-sm font-normal text-muted-foreground">
						/ night
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="py-8 text-center space-y-4">
					<div className="flex justify-center">
						<div className="rounded-full bg-primary/10 p-4">
							<LogIn className="h-8 w-8 text-primary" />
						</div>
					</div>
					<div className="space-y-2">
						<h3 className="font-semibold text-lg">Log in to book</h3>
						<p className="text-sm text-muted-foreground">
							Create an account or log in to book this property
						</p>
					</div>
				</div>

				<Link href="/login" className="block">
					<Button className="w-full" size="lg">
						Log in
					</Button>
				</Link>

				<p className="text-xs text-center text-muted-foreground">
					Don't have an account?{" "}
					<Link href="/signup" className="underline hover:text-foreground">
						Sign up
					</Link>
				</p>
			</CardContent>
		</Card>
	);
}
