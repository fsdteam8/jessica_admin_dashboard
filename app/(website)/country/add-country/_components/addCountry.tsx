"use client"
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function CountryStateForm() {
    const [country, setCountry] = useState('');
    const [states, setStates] = useState([{ stateName: '', divisions: [{ divisionName: '' }] }]);
    const sesion = useSession()
    const toekn = sesion?.data?.accessToken

    // --- mutation function ---
    const mutation = useMutation({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutationFn: async (data: any) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/country-state`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${toekn}`,
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to submit data");
            }

            return res.json();
        },
        onSuccess: () => {
            toast.success("Data submitted successfully!");
        },
        onError: (error) => {
            toast.error("Error submitting data: " + error.message);
        },
    });

    const addState = () => {
        setStates([...states, { stateName: '', divisions: [{ divisionName: '' }] }]);
    };

    const removeState = (index: number) => {
        setStates(states.filter((_, i) => i !== index));
    };

    const updateStateName = (index: number, value: string) => {
        const newStates = [...states];
        newStates[index].stateName = value;
        setStates(newStates);
    };

    const addDivision = (stateIndex: number) => {
        const newStates = [...states];
        newStates[stateIndex].divisions.push({ divisionName: '' });
        setStates(newStates);
    };

    const removeDivision = (stateIndex: number, divIndex: number) => {
        const newStates = [...states];
        newStates[stateIndex].divisions = newStates[stateIndex].divisions.filter((_, i) => i !== divIndex);
        setStates(newStates);
    };

    const updateDivisionName = (stateIndex: number, divIndex: number, value: string) => {
        const newStates = [...states];
        newStates[stateIndex].divisions[divIndex].divisionName = value;
        setStates(newStates);
    };

    const handleSubmit = () => {
        const data = {
            countryName: country,
            states: states
                .map((s) => ({
                    stateName: s.stateName,
                    divisions: s.divisions.filter((d) => d.divisionName.trim() !== ''),
                }))
                .filter((s) => s.stateName.trim() !== ''),
        };

        mutation.mutate(data);
    };

    return (
        <Card className="w-full mx-auto">
            <CardHeader className='my-6'>
                <CardTitle>Country, States, and Divisions Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Enter country name"
                    />
                </div>

                <div className="space-y-4">
                    <Label>States</Label>
                    {states.map((state, stateIndex) => (
                        <Card key={stateIndex} className="p-4 space-y-4">
                            <div className="flex items-center space-x-2">
                                <Input
                                    value={state.stateName}
                                    onChange={(e) => updateStateName(stateIndex, e.target.value)}
                                    placeholder="Enter state name"
                                    className="flex-1"
                                />
                                <Button
                                    variant="destructive"
                                    onClick={() => removeState(stateIndex)}
                                >
                                    Remove State
                                </Button>
                            </div>

                            <div className="space-y-2 pl-4">
                                <Label>Divisions for {state.stateName || `State ${stateIndex + 1}`}</Label>
                                {state.divisions.map((division, divIndex) => (
                                    <div key={divIndex} className="flex items-center space-x-2">
                                        <Input
                                            value={division.divisionName}
                                            onChange={(e) => updateDivisionName(stateIndex, divIndex, e.target.value)}
                                            placeholder="Enter division name"
                                            className="flex-1"
                                        />
                                        <Button
                                            variant="destructive"
                                            onClick={() => removeDivision(stateIndex, divIndex)}
                                        >
                                            Remove Division
                                        </Button>
                                    </div>
                                ))}
                                <Button variant="outline" onClick={() => addDivision(stateIndex)}>
                                    Add Division
                                </Button>
                            </div>
                        </Card>
                    ))}
                    <Button variant="outline" onClick={addState}>
                        Add State
                    </Button>
                </div>

                <Button
                    onClick={handleSubmit}
                    className="w-full"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Submitting..." : "Submit"}
                </Button>
            </CardContent>
        </Card>
    );
}
