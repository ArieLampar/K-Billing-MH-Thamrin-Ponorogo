import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
            <Card className="w-full max-w-sm shadow-xl rounded-[1.5rem] border-primary/10">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl font-bold text-primary">K-Billing</CardTitle>
                    <CardDescription>Login untuk mengakses data siswa</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">

                    {/* Google Login */}
                    <form
                        action={async () => {
                            "use server";
                            await signIn("google", { redirectTo: "/dashboard" });
                        }}
                    >
                        <Button variant="outline" className="w-full rounded-full" type="submit">
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                            Lanjutkan dengan Google
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or</span>
                        </div>
                    </div>

                    {/* Email Login (Magic Link) */}
                    <form
                        action={async (formData) => {
                            "use server";
                            await signIn("resend", { ...Object.fromEntries(formData), redirectTo: "/dashboard" });
                        }}
                        className="grid gap-2"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required className="rounded-xl" />
                        </div>
                        <Button className="w-full rounded-full bg-primary hover:bg-primary/90" type="submit">
                            Masuk dengan Email
                        </Button>
                    </form>

                </CardContent>
            </Card>
        </div>
    );
}
