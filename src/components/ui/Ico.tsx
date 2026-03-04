interface IcoProps { d: string; c?: string; }

export default function Ico({ d, c = "w-5 h-5" }: IcoProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" className={c}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d={d} />
    </svg>
  );
}