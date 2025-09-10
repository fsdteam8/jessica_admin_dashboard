"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type Division = {
  divisionName: string;
};

type State = {
  stateName: string;
  divisions: Division[];
};

type Country = {
  _id: string;
  countryName: string;
  states: State[];
};

export default function CountryTable() {
  const router = useRouter();
  const session = useSession();
  const token = session?.data?.accessToken;
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/country-state/all`
      );
      if (!res.ok) throw new Error("Failed to fetch countries");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/country-state/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete country");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Country deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
    onError: (error) => {
      toast.error("Error deleting: " + error.message);
    },
  });


  if (isLoading) {
    return <p className="p-4">Loading...</p>;
  }

  if (isError) {
    return <p className="p-4 text-red-500">Error loading data.</p>;
  }

  const countries: Country[] = data?.data || [];

  const handleEdit = (countryId: string) => {
    router.push(`/country/update-country/${countryId}`);
  };

  // ✅ Fixed delete mutation

  const handleDelete = (countryId: string) => {
    mutation.mutate(countryId);
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Countries, States & Divisions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="border border-gray-300">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="px-4 py-2 border w-1/4">Country</TableHead>
              <TableHead className="px-4 py-2 border w-1/4">State</TableHead>
              <TableHead className="px-4 py-2 border w-1/2">Divisions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries.map((country) => (
              <>
                {/* Country Row with Actions */}
                <TableRow key={country._id} className="bg-gray-50 font-semibold">
                  <TableCell
                    colSpan={3}
                    className="border px-4 py-3 flex items-center justify-between"
                  >
                    <span>{country.countryName}</span>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(country._id)}
                      >
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(country._id)}
                        disabled={mutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {mutation.isPending ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {/* States and Divisions */}
                {country.states.map((state, stateIndex) => (
                  <TableRow key={`${country._id}-${stateIndex}`}>
                    <TableCell className="border px-4 py-2 align-top"></TableCell>
                    <TableCell className="border px-4 py-2 align-top font-medium">
                      {state.stateName}
                    </TableCell>
                    <TableCell className="border px-4 py-2">
                      <ul className="list-disc list-inside space-y-1">
                        {state.divisions.map((division, divIndex) => (
                          <li key={divIndex}>{division.divisionName}</li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
