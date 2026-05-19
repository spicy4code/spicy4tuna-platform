import { createClient } from '@supabase/supabase-js'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const PLAYLISTS = [
  { id: 'PL9XxulgDZKuzf6zuPWcuF6anvQOrukMom', type: 'semanal', prefix: 'S' },
  { id: 'PL9XxulgDZKuy2gUxMXnitWLcyzyDvcbqM', type: 'extra_spicy', prefix: 'E' },
]

async function getPlaylistVideos(playlistId: string) {
  let videos: any[] = []
  let nextPageToken = ''

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.error) {
      console.error('Error:', data.error.message)
      break
    }
    videos = [...videos, ...(data.items || [])]
    nextPageToken = data.nextPageToken || ''
  } while (nextPageToken)

  return videos
}

async function getVideoDetails(videoIds: string[]) {
  const chunks = []
  for (let i = 0; i < videoIds.length; i += 50) {
    chunks.push(videoIds.slice(i, i + 50))
  }
  let details: any[] = []
  for (const chunk of chunks) {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${chunk.join(',')}&key=${YOUTUBE_API_KEY}`
    const res = await fetch(url)
    const data = await res.json()
    details = [...details, ...(data.items || [])]
  }
  return details
}

function extractEpisodeNumber(title: string, prefix: string): string | null {
  if (prefix === 'S') {
    const match = title.match(/#(\d+)\s*$/)
    if (match) return `S${match[1]}`
  }
  return null
}

async function main() {
  console.log('Limpiando tablas...')
  await supabase.from('clips').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('episodes').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  for (const playlist of PLAYLISTS) {
    console.log(`\nProcesando playlist: ${playlist.type}`)
    const playlistVideos = await getPlaylistVideos(playlist.id)
    console.log(`Videos encontrados: ${playlistVideos.length}`)

    const videoIds = playlistVideos.map((v: any) => v.contentDetails.videoId)
    const videoDetails = await getVideoDetails(videoIds)

    // Ordenar por fecha ascendente para numeracion correcta
    const sorted = videoDetails.sort((a, b) =>
      new Date(a.snippet.publishedAt).getTime() - new Date(b.snippet.publishedAt).getTime()
    )

    let counter = 1
    for (const video of sorted) {
      const title = video.snippet.title
      const publishedAt = video.snippet.publishedAt

      let episodeNumber = extractEpisodeNumber(title, playlist.prefix)
      if (!episodeNumber) {
        episodeNumber = `${playlist.prefix}${counter}`
        counter++
      } else {
        counter++
      }

      const { error } = await supabase.from('episodes').upsert({
        title,
        type: playlist.type,
        episode_number: episodeNumber,
        published_at: publishedAt?.split('T')[0],
        url_youtube: `https://www.youtube.com/watch?v=${video.id}`,
        thumbnail_url: video.snippet.thumbnails?.high?.url,
        description: video.snippet.description?.slice(0, 500),
        status: 'published',
      }, {
        onConflict: 'episode_number',
        ignoreDuplicates: true,
      })

      if (error) console.error(`Error: ${title} - ${error.message}`)
      else console.log(`OK [${episodeNumber}]: ${title}`)
    }
  }

  console.log('\nImportacion completada!')
}

main().catch(console.error)