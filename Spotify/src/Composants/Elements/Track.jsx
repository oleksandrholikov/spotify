import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

library.add(fas, fab, far);
export function Track({track, addTrackToPlaylist}){
    return(
        <div
  key={track.id}
  className="flex flex-col gap-2 justify-center items-center bg-black rounded-lg p-4 text-white"
>
  <h3 className="text-lg font-semibold">{track.name}</h3>
  <div className="flex  gap-2 items-center">
    <audio src={track.mp3} controls className="w-full max-w-xs" />
    <FontAwesomeIcon icon={["fas", "square-plus"]} className="text-xl cursor-pointer hover:text-green-500 transition" onClick={() => addTrackToPlaylist(track)}/>
  </div>
</div>
    )
}