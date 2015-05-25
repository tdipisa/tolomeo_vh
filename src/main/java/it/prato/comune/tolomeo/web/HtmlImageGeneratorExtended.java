package it.prato.comune.tolomeo.web;

import gui.ava.html.image.generator.HtmlImageGenerator;
import gui.ava.html.image.util.FormatNameUtil;
import gui.ava.html.image.util.SynchronousHTMLEditorKit;

import java.awt.AlphaComposite;
import java.awt.ComponentOrientation;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.URL;

import javax.imageio.ImageIO;
import javax.swing.BorderFactory;
import javax.swing.JEditorPane;

public class HtmlImageGeneratorExtended extends HtmlImageGenerator {
	private float scaleFactor = 1;
	
    private JEditorPane editorPane;
    static final Dimension DEFAULT_SIZE = new Dimension(800, 800);

    public HtmlImageGeneratorExtended(float scaleFactor) {
    	this.scaleFactor = scaleFactor;
    	editorPane = createJEditorPane();
    }

    public ComponentOrientation getOrientation() {
            return editorPane.getComponentOrientation();
    }

    public void setOrientation(ComponentOrientation orientation) {
            editorPane.setComponentOrientation(orientation);
    }

    public Dimension getSize() {
            return editorPane.getSize();
    }

    public void setSize(Dimension dimension) {
            editorPane.setSize(dimension);
    }

    public void loadUrl(URL url) {
            try {
                    editorPane.setPage(url);
            } catch (IOException e) {
                    throw new RuntimeException(String.format("Exception while loading %s", url), e);
            }
    }

    public void loadUrl(String url) {
            try {
                    editorPane.setPage(url);
            } catch (IOException e) {
                    throw new RuntimeException(String.format("Exception while loading %s", url), e);
            }
    }

    public void loadHtml(String html) {
            editorPane.setText(html);
            onDocumentLoad();
    }

    public void saveAsImage(String file) {
            saveAsImage(new File(file));
    }

    public void saveAsImage(File file) {

            BufferedImage img = getBufferedImage();
            try {
                    final String formatName = FormatNameUtil.formatForFilename(file.getName());
                    ImageIO.write(img, formatName, file);
            } catch (IOException e) {
                    throw new RuntimeException(String.format("Exception while saving '%s' image", file), e);
            }
    }

    public Dimension getDefaultSize() {
            return DEFAULT_SIZE;
    }

    public BufferedImage getBufferedImage() {
            Dimension prefSize = editorPane.getPreferredSize();
            BufferedImage img = new BufferedImage(prefSize.width, prefSize.height, BufferedImage.TYPE_INT_ARGB);
            Graphics2D graphics = img.createGraphics();
            graphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);            
            editorPane.setSize(prefSize);
            editorPane.paint(graphics);
            return img;
    }

    protected JEditorPane createJEditorPane() {
            final JEditorPane editorPane = new JEditorPane();
            editorPane.setSize(getDefaultSize());
            editorPane.setEditable(false);
            final SynchronousHTMLEditorKit kit = new SynchronousHTMLEditorKit();
            editorPane.setEditorKitForContentType("text/html", kit);
            editorPane.setContentType("text/html");
            
            editorPane.setBorder(BorderFactory.createEmptyBorder());
            editorPane.setOpaque(false);
            editorPane.putClientProperty(JEditorPane.HONOR_DISPLAY_PROPERTIES, true);
    		Font font = new Font("Arial", Font.PLAIN, Math.round(10*scaleFactor));
    		editorPane.setFont(font);
    		
            return editorPane;
    }
	
}
