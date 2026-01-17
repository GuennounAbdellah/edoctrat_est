interface Result<Type> {
    [x: string]: unknown;
    count: number,
    next: string | null, 
    previous: string | null, 
    results: Type[]
}

export default Result;