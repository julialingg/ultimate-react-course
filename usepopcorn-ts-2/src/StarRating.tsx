import { useState } from "react"

type StarRatingProps = {
  maxRating?: number;
  onSetRating: (rating: number) => void;
};

export default function StarRating({ maxRating = 10, onSetRating }: StarRatingProps) {

  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const displayRating = hoveredRating || 0;



  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div>
        {Array.from({ length: maxRating }, (_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= displayRating;

          return (
            <>
              <button
                key={starValue}
                type="button"
                onMouseEnter={() => setHoveredRating(starValue)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => onSetRating(starValue)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "32px",
                  padding: 0,
                  color: "white"
                }}
              >
                {isFilled ? "★" : "☆"}
              </button>
            </>
          );
        })}
      </div>

      <span>{displayRating > 0 ? displayRating : "10"}</span>
    </div>
  );
}