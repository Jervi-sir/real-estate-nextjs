import { PropertyForm } from "@/components/property-form";

export default function NewPropertyPage() {
    return (
        <div className="container mx-auto py-10 px-4 md:px-0">
            <h1 className="text-3xl font-bold mb-8">Create New Listing</h1>
            <PropertyForm />
        </div>
    );
}
