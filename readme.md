# bpm-publish

The publishing sub-command used by [brainpm/bpm](https://github.com/brainpm/bpm/blob/master/readme.md).

TODO
- [ ] move all github-specific code here
  - [x] from CLI which still gets its TOC eigenmächtig
  - [ ] from web-player
- [ ] rename to bpm-github
- [ ] unpublish
- [ ] clean up publish module
- [ ] repair bpm sub-commands (play, walk, ...)
- [ ] `bpm toc` should display all meaningful meta-data
- [x] tell debundler to use new bpm-github API
- [ ] implement new (de)bundler API
  - [x] getMetaData(retrievalObject)
  - [ ] getContent(retrievalObject)
--------

Use case web-player:

webplayer on init needs  TOC
    storageAdaper.egtRetrievalStream()
        returns stream of retrieval objects (name, getFileStream)

    webplayer plugs retrieval stream into debundler.getMetaData
        bundler.getMetaData(retrievalObject)
            // bundler does
            return JSON.parse(retrievalObject.getFileStream('paackage.json'))

if an episode needs to be displayed, player requests content from debundler
    bundler.getContent(getFileStream)
        returns DocumentFragment (HTML with JS handlers already attached)

