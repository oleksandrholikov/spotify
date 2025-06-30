export function Artist ({artist, artistClick}){

    return(
        <div key={artist.id} onClick={() => artistClick(artist)} className="w-fit flex flex-col rounded-lg shadow-lg justify-center items-center hover:cursor-pointer hover:shadow-slate-700 hover:bg-[#000000] hover:scale-110 transition delay-50 ease-in-out">
        <h4>{artist.name}</h4>
        <img src={artist.photo} alt={artist.name} className="w-50 h-50 max-w-none"/>
        </div>
    )
}

