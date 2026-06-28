interface BannerProps {
  text: string;
  type: "Info" | "Error" | "Warning";
}

export function Banner(props: BannerProps) {
  let textColor: string;
  let bgColor: string;
  switch (props.type) {
    case "Info":
      textColor = "text-green-900";
      bgColor = "bg-green-100";
      break;
    case "Error":
      textColor = "text-red-900";
      bgColor = "bg-red-100";
      break;
    case "Warning":
      textColor = "text-amber-900";
      bgColor = "bg-amber-100";
      break;
  }
  return (
    <>
      <p
        className={`rounded-lg ${bgColor} px-4 py-1 font-semibold ${textColor} shadow-sm`}
      >
        {props.text}
      </p>
    </>
  );
}
