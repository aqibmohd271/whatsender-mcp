export function BrandCredit() {
    const year = new Date().getFullYear();
    return (
        <p className="text-sm text-muted-foreground text-center">
            Copyright © {year}. All rights reserved. Built with{" "}
            <span className="text-red-500" role="img" aria-label="love">♥</span>{" "}
            by{" "}
            <a href="https://codeupp.xyz/" target="_blank" rel="noopener noreferrer"
                className="font-medium hover:text-foreground underline underline-offset-4">
                Mohammad Aqib
            </a>
        </p>
    );
}
