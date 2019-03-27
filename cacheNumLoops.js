chrome.storage.local.get(['NUM_LOOPS'], function(res) {
if (res.num_loops != undefined) {
  NUM_LOOPS = res.num_loops; // int
}
});