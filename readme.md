# bpm-publish

The publishing sub-command used by [brainpm/bpm](https://github.com/brainpm/bpm/blob/master/readme.md).

TODO
- [ ] move all github-specific code here
- [ ] rename to bpm-github
- [ ] unpublish
--------
status quo: "github storage adapter" done, module needs to be renamed and publish module cleaned up
so far takes bundle files, publishes them. takes org and gh-name and provides stream of retrieval information (episode names and getFileStream)
to do: tell debundler to use this new API

Use case web-player:

webplayer on init needs  TOC
    storageAdaper.egtRetrievalStream()
        returns stream of retrieval objects (name, getFileStream)

    webplayer plugs retrieval stream into debundler.getMetaData
        bundler.getMetaData(getFileStream)
            // bundler does
            return JSON.parse(getFileStream('paackage.json'))

if an episode needs to be displayed, player requests content from debundler
    bundler.getContent(getFileStream)
        returns HTML

