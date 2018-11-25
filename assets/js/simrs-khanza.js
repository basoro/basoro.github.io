$(document).ready(function () {
    var repo = GetParameterByName("repo");
    if (!repo) {
        repo = "basoro/SIMRS-Khanza";
    }
    GetReleases(repo);
});

function GetReleases(repo) {
    $.getJSON("https://api.github.com/repos/" + repo + "/releases").done(function (json) {
        var totalDownloadCount = 0;
        previousUpdatedAt = moment();

        for (var i = 0; i < json.length; i++) {
            var release = json[i];
            if (release.assets.length === 0) {
                continue;
            }
            var asset = release.assets[0];
            var fileSize = Math.round(asset.size / 1024);
            var downloadCount = 0;
            for (var i2 = 0; i2 < release.assets.length; i2++) {
                downloadCount += release.assets[i2].download_count;
            }
            totalDownloadCount += downloadCount;
            var updatedAt = moment(asset.updated_at);
            var activeDays = previousUpdatedAt.diff(updatedAt, "days", true);
            previousUpdatedAt = updatedAt;
            $(".table-downloads tbody")
                .append($("<tr>")
                    .append($("<td>")
                        .append($("<a>")
                            .attr("href", release.html_url)
                            .text(release.name)
                        )
                        .append(release.prerelease ? "<div style=\"display:inline;margin-left:10px;\"><span style=\"background-color:red;color:white;border-radius:2px;padding:3px;font-size:11px;\">Pre-release</span></div>" : "<div style=\"display:inline;margin-left:10px;\"><span style=\"background-color:white;color:green;border:1px solid green;border-radius:2px;padding:3px;font-size:11px;\">Final Release</span></div>")
                        .append($("<div style=\"margin-top:10px;font-size:12px;\">")
                             .text(release.body)
                        )
                    )
                    .append($("<td>")
                        .append($("<a>")
                            .attr("href", asset.browser_download_url)
                            .text(fileSize.toLocaleString() + " KB")
                        )
                    )
                    .append($("<td class=\"none\">")
                        .text(downloadCount.toLocaleString())
                    )
                    .append($("<td class=\"none\">")
                    //    .text(moment(asset.updated_at).format("YYYY-MM-DD HH:mm"))
                        .text(moment(asset.updated_at).format("YYYY-MM-DD"))
                    )
                    //.append($("<td>")
                    //    .text(activeDays.toFixed(1))
                    //)
                );
        }

        if (totalDownloadCount > 0)
        {
            $(".total-downloads").text(" (" + totalDownloadCount.toLocaleString() + " downloads)");
        }

        $(".fa-spin").hide();
        $(".table-downloads").fadeIn();
    });
}

function GetParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
