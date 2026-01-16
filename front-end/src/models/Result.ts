interface Result<Type> {
    [x: string]: any;
    count: number,
    next: string | null, 
    previous: string | null, 
    results: Type[]
}

export default Result;