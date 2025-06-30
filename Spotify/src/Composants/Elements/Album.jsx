export function Album({album, handleClick}){
    return(
        <div
                key={album.id}
                onClick={() => handleClick(album)}
                className=" p-2 hover:cursor-pointer rounded-lg shadow-lg hover:shadow-slate-700 hover:bg-[#000000] hover:scale-110 transition delay-50 ease-in-out"
              >
                <h4 className="text-xl w-full">{album.name}</h4>
                <img className=" max-w-none" src={album.cover_small} alt={album.name} />
                <h5>
                  {new Date(album.release_date * 1000).toLocaleDateString(
                    "fr-FR"
                  )}
                </h5>
              </div>
    )
}